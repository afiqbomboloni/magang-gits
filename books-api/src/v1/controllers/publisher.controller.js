const db = require("../../models");
const Publisher = db.publishers;

const Op = db.Sequelize.Op;

// Create and Save a new Publisher
exports.create = (req, res) => {
    // Validate
    if(!req.body.nama) {
        res.status(400).send({
            message: "Semuanya harus terisi"
        });
        return;
    }

    // create publisher
    const publisher = {
        nama: req.body.nama,
        book_id: req.body.book_id
    };

    // Save in db
    Publisher.create(publisher)
        .then(data => {
            res.status(201).send(data)
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Ada error nih"
            })
        })
  
};


// Retrieve all Publishers from the database.
exports.findAll = (req, res) => {
    
  let {filter, sort, pagination} = req.query
  let paramQuery = {}
  let limit
  let offset

  // filtering
  if (filter !== '' && typeof filter !== 'undefined') {
    const query = filter.publisher.split(',').map((item) => ({
      [Op.eq]: item,
    }));

    paramQuery.where = {
      id: { [Op.or]: query },
    };
  }

  // sorting
  if(sort !== '' && typeof sort !== 'undefined') {
    let query;
    if(sort.charAt(0) !== '-') {
      query = [[sort, 'ASC']]
    } else {
      query = [[sort.replace('-', ''), 'DESC']]
    }

    paramQuery.order = query

  }

  // pagination
  if(pagination !== '' && typeof pagination !== 'undefined' ) {
    if(pagination.size !== '' && typeof pagination.size !== 'undefined') {
      limit = pagination.size
      paramQuery.limit = limit
    }

    if(pagination.number !== '' && typeof pagination.number !== 'undefined') {
      offset = pagination.number * limit - limit
      paramQuery.offset = offset
    }
  } else {
    limit = 4
    offset = 0
    paramQuery.limit = limit
    paramQuery.offset = offset
  }
  
    Publisher.findAll(paramQuery)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving authors."
        });
      });
  };

// Find a single Publisher with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Publisher.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Publisher with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Publisher with id=" + id
      });
    });
};

// Update a Publisher by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
  
    Publisher.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Publisher was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Publisher with id=${id}. Maybe Publisher was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Publisher with id=" + id
        });
      });
  };

// Delete a Publisher with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Publisher.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Publisher was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Publisher with id=${id}. Maybe Publisher was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Publisher with id=" + id
        });
      });
  };

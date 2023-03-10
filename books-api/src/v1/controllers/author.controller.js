// const { query } = require("express");
const db = require("../../models");
const Author = db.authors;
const Book = db.books;


const Op = db.Sequelize.Op;

// Create and Save a new Author
exports.create = (req, res) => {
    // Validate
    if(!req.body.nama || !req.body.asal) {
        res.status(400).send({
            message: "Semuanya harus terisi"
        });
        return;
    }

    // create author
    const author = {
        nama: req.body.nama,
        asal: req.body.asal,

    };

    // Save in db
    Author.create(author)
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


// Retrieve all Authors from the database.
exports.findAll = (req, res) => {

    let {filter, sort, pagination} = req.query
    let paramQuery = {}
    let limit
    let offset

    // filtering
    if (filter !== '' && typeof filter !== 'undefined') {
      const query = filter.author.split(',').map((item) => ({
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



    
    Author.findAll(paramQuery)
      .then(data => {
        console.log("success fetch data from db")
        return res.send(data)
        
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving authors."
        });
      });
  };



// Find a single Author with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Author.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Author with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Author with id=" + id
      });
    });
};

// Update a Author by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
  
    Author.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Author was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Author with id=${id}. Maybe Author was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Author with id=" + id
        });
      });
  };

// Delete a Author with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Author.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Author was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Author with id=${id}. Maybe Author was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Author with id=" + id
        });
      });
  };

// get one to many

exports.getAuthorBooks = async (req, res) => {
  const id = req.params.id

  const data = await Author.findOne({
    include: [{
      model: Book,
      as: "book"
    }],
    where: {id: id}
  })

  res.status(200).send(data)
}

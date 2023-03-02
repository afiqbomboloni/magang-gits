const db = require("../../models");
const Book = db.books;
const Publisher = db.publishers;

const Op = db.Sequelize.Op;

// Create and Save a new Book
exports.create = (req, res) => {
    // Validate
    if(!req.body.judul || !req.body.tema || !req.body.author_id) {
        res.status(400).send({
            message: "Semuanya harus terisi"
        });
        return;
    }

    // create book
    const book = {
        judul: req.body.judul,
        tema: req.body.tema,
        author_id: req.body.author_id
    };

    // Save in db
    Book.create(book)
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


// Retrieve all Books from the database.
exports.findAll = (req, res) => {
    

  let {filter, sort, pagination} = req.query
  let paramQuery = {}
  let limit
  let offset

  // filtering
  if (filter !== '' && typeof filter !== 'undefined') {
    const query = filter.book.split(',').map((item) => ({
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
    Book.findAll(paramQuery)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving books."
        });
      });
  };

// Find a single Book with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Book.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Book with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Book with id=" + id
      });
    });
};

// Update a Book by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
  
    Book.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Book was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Book with id=${id}. Maybe Book was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Book with id=" + id
        });
      });
  };

// Delete a Book with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
  
    Book.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Book was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Book with id=${id}. Maybe Book was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Author with id=" + id
        });
      });
  };


  // get one to one

exports.getBookPublisher = async (req, res) => {
    const id = req.params.id
  
    const data = await Book.findOne({
      include: [{
        model: Publisher,
        as: "publisher"
      }],
      where: {id: id}
    })

    res.status(200).send(data)
}
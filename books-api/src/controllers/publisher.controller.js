const db = require("../models");
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
            res.send(data)
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
    const nama = req.query.nama;
    var condition = nama ? { nama: { [Op.iLike]: `%${nama}%` } } : null;
  
    Publisher.findAll({ where: condition })
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

// // get one to many

// exports.getAuthorBooks = async (req, res) => {
//   const id = req.params.id

//   const data = await Author.findOne({
//     include: [{
//       model: Book,
//       as: "book"
//     }],
//     where: {id: id}
//   })

//   res.status(200).send(data)
// }

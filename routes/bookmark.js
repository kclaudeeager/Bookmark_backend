let mongoose = require('mongoose');
let Bookmark = require('../models/bookmark');

/*
 * GET /book route to retrieve all the books.
 */
function getBookmarks(req, res) {
    //Query the DB and if no errors, send all the books
    let query = Bookmark.find({});
    query.exec((err, bookmark) => {
        if(err) res.send(err);
        //If no errors, send them back to the client
        res.json(bookmark);
    });
}

/*
 * POST /book to save a new book.
 */
function postBookmark(req, res) {
    //Creates a new book
    var newBookmark= new Bookmark(req.body);
    //Save it into the DB.
    newBookmark.save((err,bookmark) => {
        if(err) {
            res.send(err);
        }
        else { //If no errors, send it back to the client
            res.json({message: "Bookmark successfully added!", bookmark});
        }
    });
}

/*
 * GET /book/:id route to retrieve a book given its id.
 */
function getBookmark(req, res) {
    Bookmark.findById(req.params.id, (err, bookmark) => {
        if(err) res.send(err);
        //If no errors, send it back to the client
        res.json(bookmark);
    });        
}

/*
 * DELETE /book/:id to delete a book given its id.
 */
function deleteBookmark(req, res) {
    Bookmark.remove({_id : req.params.id}, (err, result) => {
        if(err) res.send(err);
        res.json({ message: "Bookmark successfully deleted!", result });
    });
}

/*
 * PUT /book/:id to updatea a book given its id
 */
function updateBookmark(req, res) {
    Bookmark.findById({_id: req.params.id}, (err, bookmark) => {
        if(err) res.send(err);
        Object.assign(bookmark, req.body).save((err, bookmark) => {
            if(err) res.send(err);
            res.json({ message: 'Booknark updated!', bookmark });
        });    
    });
}

//export all the functions
module.exports = { getBookmarks, postBookmark, getBookmark, deleteBookmark, updateBookmark };
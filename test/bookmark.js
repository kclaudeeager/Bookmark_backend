process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
let Bookmark = require('../models/bookmark');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);

describe('Bookmarks', () => {
    beforeEach((done) => {
        Bookmark.deleteMany({}, (err) => { 
           done();           
        });        
    });
  describe('/GET bookmark', () => {
      it('it should GET all the bookmarks', (done) => {
            chai.request(server)
            .get('/bookmark')
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('array');
                  res.body.length.should.be.eql(0);
              done();
            });
      });
  });
  describe('/POST bookmark', () => {
      it('it should not POST a bookmark without link field', (done) => {
          let bookmark = {
              title: "The Lord of the Rings",
              author: "J.R.R. Tolkien",
              description:"This is the nice book ever",
              category:"Book",
               
          }
            chai.request(server)
            .post('/bookmark')
            .send(bookmark)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('errors');
                  res.body.errors.should.have.property('link');
                  res.body.errors.link.should.have.property('kind').eql('required');
              done();
            });
      });
      it('it should POST a bookmark ', (done) => {
        let bookmark = {
            title: "The Lord of the Rings",
            author: "J.R.R. Tolkien",
            description:"This is the nice book ever",
            category:"Book",
            link:"https://book.com"
        }
            chai.request(server)
            .post('/bookmark')
            .send(bookmark)
            .end((err, res) => {
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('message').eql('Bookmark successfully added!');
                  res.body.bookmark.should.have.property('title');
                  res.body.bookmark.should.have.property('author');
                  res.body.bookmark.should.have.property('description');
                  res.body.bookmark.should.have.property('category');
                  res.body.bookmark.should.have.property('link');
              done();
            });
      });
  });
  describe('/GET/:id bookmark', () => {
      it('it should GET a bookmark by the given id', (done) => {
    let bookmark= new Bookmark({title: "The Lord of the Rings",author: "J.R.R. Tolkien",description:"This is the nice book ever",category:"Book",link:"https://book.com"});
       bookmark.save((err, bookmark) => {
             //console.log(bookmark)
             chai.request(server)
            .get('/bookmark/'+bookmark.id)
            .send(bookmark)
            .end((err, res) => {
             
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  
                  res.body.bookmark.should.have.property('title');
                  res.body.bookmark.should.have.property('author');
                  res.body.bookmark.should.have.property('description');
                  res.body.bookmark.should.have.property('category');
                  res.body.bookmark.should.have.property('link');
                  res.body.bookmark.should.have.property('_id').eql(bookmark.id);
              done();
            });
          });

      });
  });
  describe('/PUT/:id bookmark', () => {
      it('it should UPDATE a bookmark given the id', (done) => {
          let bookmark= new Bookmark({  author: "J.R.R. Tolkien",
          description:"This is the nice book ever",
          category:"Book",
          title: "The Lord of the Rings",
          link:"https://book.com"})
          bookmark.save((err, bookmark) => {
                chai.request(server)
                .put('/bookmark/' + bookmark.id)
                .send({ author: "J.R.R. Tolkien",
                description:"This is the nice book ever",
                category:"Book",
                title: "The Lord of the Rings",
                link:"https://book.com"})
                .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      //console.log(res.body)
                      res.body.should.have.property('message').eql('Bookmark updated!');
                      res.body.bookmark.should.have.property('category').eql("Book");
                  done();
                });
          });
      });
  });
 /*
  * Test the /DELETE/:id route
  */
  describe('/DELETE/:id bookmark', () => {
      it('it should DELETE a book given the id', (done) => {
          let bookmark = new Bookmark({ author: "J.R.R. Tolkien",
          description:"This is the nice book ever",
          category:"Book",
          title: "The Lord of the Rings",
          link:"https://book.com"})
          bookmark.save((err, book) => {
                chai.request(server)
                .delete('/bookmark/' + bookmark.id)
                .end((err, res) => {
                      res.should.have.status(200);
                      res.body.should.be.a('object');
                      res.body.should.have.property('message').eql('Bookmark successfully deleted!');
                      //console.log(res)
                      res.should.have.property('ok').eql(true)
                      res.body.result.should.have.property('acknowledged').eql(true);
                      res.body.result.should.have.property('deletedCount').eql(1);
                  done();
                });
          });
      });
  });
});
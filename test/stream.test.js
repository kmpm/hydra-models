var assert = require('assert')
  , should = require('should');


var Models = require('../index');
var models = new Models();
var Stream = models.Stream;

var getName = function(a){
  var b = a || 1;
  return 'mocha' + b + '.' + Date.now().toString();
}

describe("models.Stream", function(){
  before(function(done){
    Stream.where('name', /^mocha/).remove(function(err, count){
      should.not.exist(err);
      done();
    });
  });

  // after(function(done){
  //   Stream.where('name', /^mocha/).remove(function(err, count){
  //     should.not.exist(err);
  //     done();
  //   });
  // });


  it("should require name", function(done){

    var s = new Stream();
    s.save(function(err){
      should.exist(err);
      err.should.have.property("name", "ValidationError");
    });

    s = new Stream({name:getName(1)});
    s.save(function(err){
      should.not.exist(err);
      done();
    })
  });

  describe("with existing", function(){
    var stream;
    beforeEach(function(done){
      stream = new Stream({name:getName(2)});
      stream.save(done);
    });

    it("should save raw", function(done){
      stream.raw = "22";
      stream.save(function(err){
        should.not.exist(err);
        reload();
      });

      function reload(){
        Stream.findOne({_id:stream._id}, function(err, s){
          var d = s.last_raw
          console.log("asdf", d.constructor.name);
          d.constructor.name.should.equal('Date');
          done();  
        });
        
      }
      
    });
  });

  
});
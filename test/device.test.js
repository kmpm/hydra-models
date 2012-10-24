var assert = require('assert')
  , should = require('should');


var Models = require('../index');
var models = new Models();

var Stream = models.Stream
  , Device = models.Device;

var getName = function(a){
  var b = a || 1;
  return 'mocha' + b + '.' + Date.now().toString();
}

describe("models.Device", function(){
  before(function(done){
    var WHAT=2
    Device.where('name', /^mocha/).remove(function(err, count){
      should.not.exist(err);
      console.log("removed %d of mocha* devices", count);
      when();
    });
    Device.where('name', /^mocha/).remove(function(err, count){
      should.not.exist(err);
      console.log("removed %d of mocha* streams", count);
      when();
    });
    function when(){
      WHAT--;
      if(WHAT>0) return;
      done();
    }
  });

  it("create minimal", function(done){
    var d = new models.Device();
    d.name = 'mocha1.' + Date.now().toString();
    d.save(function(err){
      should.not.exist(err);
      done();
    });
  });

  it("create minimal with 1 datastream", function(done){
    var d = new models.Device();
    d.name =getName(1);
    var s = new Stream();
    d.streams.push(s);
    d.save(function(err){
      should.not.exist(err);
      done();
    });
  });


  describe("#streams", function(){
    var d,s1,s2;
    before(function(done) {
      models.Device.find({'name':'mocha3'}).remove(create);
      function create(err) {
        var WHAT=3;
        should.not.exist(err);
        d = new Device({name:'mocha3'});
        s1 = new Stream({name:'1'});
        s2 = new Stream({name:'2'});
        s1.save(when);
        s2.save(when);
        d.streams.push(s1);
        d.streams.push(s2);
        d.save(function(err){
          should.not.exist(err);
          when();
        });
        function when(err){
          should.not.exist(err);
          WHAT--;
          if(WHAT >0) return;
          done();
        }
      }
    });

    it("should be able to populate", function(done){
      var query = Device.findOne({_id:d._id})
        .populate('streams')
        .exec(function(err, device){
          should.not.exist(err);
          device.streams.should.be.an.instanceOf(Array);
          device.streams.should.have.length(2);
          s1._id.toString().should.equal(device.streams[0]._id.toString());
          s2._id.toString().should.equal(device.streams[1]._id.toString());
          done();
        });
    });
  });

  

  

  

});

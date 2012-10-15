var assert = require('assert')
  , should = require('should');


var models = require('../index');


describe("models.Device", function(){
  before(function(done){
    models.Device.where('name', /^moca/).remove(function(err){
      should.not.exist(err);
      done();
    });
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
    d.name = 'mocha1.' + Date.now().toString();
    d.datastreams.push({name:'1'});
    d.save(function(err){
      should.not.exist(err);
      done();
    });
  });


  describe("func_cv", function(){
    before(function(done){
      models.Device.where('name', /^mocha2/).remove(function(err, count){
        should.not.exist(err);
        console.log("removed %d out of moca2", count);

        var count =5;
        for(var i=0;i<5;i++){
          var d = new models.Device({name:'mocha2.' + i + '.' + Date.now().toString()});
          d.datastreams.push({name:'1', func_cv:'function(r) {\n return r;\n}'});
          d.save(function(err){
            should.not.exist(err);
            isall();
          });
        }

        function isall() {
          count--;
          if(count>0) return;
          done();  
        }

        
      });
    });

    it("list all func_cv", function(done){
      var query = models.Device.where('name').regex(/^mocha2/);
      query.select("name datastreams.func_cv");
      query.exec(function(err, devices){
        should.not.exist(err);
        devices.should.have.length(5);
        var d0 =devices[0];
        d0.should.have.property('datastreams');
        var d0stream = d0.datastreams[0];

        d0stream.should.have.property('func_cv');
        d0stream.should.not.have.property('status');
        done();
      });
    });
  });

  

});

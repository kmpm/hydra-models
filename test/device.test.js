var assert = require('assert')
  , should = require('should');


var models = require('../index');


describe("models.Device", function(){
  before(function(done){
    models.Device.where('name', /^mocha/).remove(function(err, count){
      should.not.exist(err);
      console.log("removed %d of mocha* devices", count);
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
    d.streams.push({name:'1'});
    d.save(function(err){
      should.not.exist(err);
      done();
    });
  });


  describe("update single stream", function(){
    before(function(done) {
      models.Device.find({'name':'mocha3'}).remove(create);
      function create(err) {
        should.not.exist(err);
        var d = new models.Device({name:'mocha3'});
        d.streams.push({name:'1'});
        d.streams.push({name:'2'});
        d.save(function(err){
          should.not.exist(err);
          done();
        });
      }
    });

    it("should update single value", function(done){

      models.Device.updateStreamValues('mocha3','2' , 
        {'raw':"123", 
          'cv': "12.3",
          'status': "ok"}, 
        function(err){
          should.not.exist(err);
          validate2();
        });

      function validate2(){
        models.Device.findOne({name:'mocha3'}, function(err, device){
          should.not.exist(err);
          device.should.have.property('streams');
          device.streams.should.have.length(2);
          device.streams[1].should.have.property('name', '2');
          device.streams[1].should.have.property('raw', '123');
          done();

        });
      }
    })

  });

  describe("func_cv", function(){
    before(function(done){
      models.Device.where('name', /^mocha2/).remove(function(err, count){
        should.not.exist(err);
        console.log("removed %d out of moca2", count);

        var count =5;
        for(var i=0;i<5;i++){
          var d = new models.Device({name:'mocha2.' + i + '.' + Date.now().toString()});
          d.streams.push({name:'1', func_cv:'function(r) {\n return r;\n}'});
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

    it("list mocha2 func_cv", function(done){
      var query = models.Device.where('name').regex(/^mocha2/);
      query.select("name streams.func_cv");
      query.exec(function(err, devices){
        should.not.exist(err);
        devices.should.have.length(5);
        var d0 =devices[0];
        d0.should.have.property('streams');
        var d0stream = d0.streams[0];

        d0stream.should.have.property('func_cv');
        d0stream.should.not.have.property('status');
        done();
      });
    });

    it("list ALL func_cv", function(done){
     
      models.Device.find_funcCv( function(err, devices){
        should.not.exist(err);
        var d0 =devices[0];
        d0.should.have.property('streams');
        d0.streams.should.be.instanceOf(Array);
        console.log(d0.streams);
        (d0.streams.length > 0).should.be.true;
        var d0stream = d0.streams[0];

        d0stream.should.have.property('func_cv');
        d0stream.should.have.property('name');
        d0stream.should.not.have.property('status');
        done();
      });
    });

  });

  

});

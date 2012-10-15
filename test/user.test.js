var assert = require('assert')
  , should = require('should');

var models = require('../index');

describe("asdf", function(){
  before(function(done){
    setTimeout(done, 500);
  });


  it("new user", function(done){
    var u = new models.User();
    var login = Date.now().toString();
    u.login = login;
    u.email = 'test@mail.local';
    u.password='prettygoodone';
    u.save(function(err){
      should.not.exist(err);
      reload();
    });

    function reload(){
      models.User.findOne({login:login}, function(err, user){
        should.not.exist(err);
        should.exist(user);

        //failing
        user.comparePassword('nogood', function(err, isMatch){
          should.not.exist(err);
          isMatch.should.not.be.ok;

        });

        user.comparePassword('prettygoodone', function(err, isMatch){
          should.not.exist(err);
          isMatch.should.be.ok;
          done();
        });
      })
    }

  });
});
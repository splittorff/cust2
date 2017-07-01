


// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var custSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  admin: Boolean,
  created_at: Date,
  updated_at: Date
});



// on every save, add the date
custSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

// the schema is useless so far
// we need to create a model using it
var Customer = mongoose.model('cust', custSchema);

// make this available to our users in our Node applications
module.exports = Customer;
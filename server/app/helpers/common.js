
module.exports.createSlug = createSlug;

function createSlug(value) {
	console.log(value);
   return value
   .toLowerCase()
   .replace(/[^\w\s]+/g,'')
   .trim() //takes away spaces tabulations in beginning and in the end of the string
   .replace(/[\s]+/g,'-'); //takes all the spaces and replaces them with hyphon
}
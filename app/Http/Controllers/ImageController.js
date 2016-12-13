'use strict'
const Helpers = use('Helpers');
const Image = use('App/Model/Image');
var path = require('path');
var fs = require('fs');
var mv = require('mv');
class ImageController {
     * index (request, response) {
     //in place of 17 provide the id of the image
        const file = yield Image.findByOrFail('id',17);
        console.log(file.imagename);
        const image_path = Helpers.storagePath('images')+"/"+file.imagename;
        yield response.sendView('image',{ image_path : image_path });
   // yield response.sendView('image');
  }

  * storeimage (request, response) {
    
    const file = request.file('image_name');
    const fileName = file.file.name;
    const filepath = file.file.path;
    //console.log('thsi is the file source',filepath);
    const image_path = Helpers.storagePath('images')+"/"+fileName;

    mv(filepath,image_path, function(err) {
    if (err) { throw err; }
console.log('file moved successfully');
});

    const image = new Image();
    image.imagename = fileName;
    //console.log(image);
    yield image.save();
    yield response.sendView('image');
}
}

module.exports = ImageController
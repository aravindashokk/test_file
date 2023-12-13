import { createServer, Model } from 'miragejs';

createServer({
  models: {
    file: Model,
  },

  routes() {
    this.namespace = 'api';

    this.post('/fileUpload', (schema, request) => {
      const formData = new FormData();
      formData.append('file', request.requestBody.get('file'));

      // Simulate a delay for file upload
      return new Promise((resolve) => {
        setTimeout(() => {
          // Create a new file record in the MirageJS database
          const file = schema.files.create({
            name: formData.get('file').name,
            size: formData.get('file').size,
          });

          resolve({
            fileId: file.id, // Return an ID for the uploaded file
            name: file.name,
            size: file.size,
            message: 'Successful file upload',
          });
        }, 100); // Simulated delay
      });
    });
  },
});

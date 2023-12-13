import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios'; // Import Axios for mocking
import Tester from '../Tester';

jest.mock('axios'); // Mock Axios

test('File upload functionality', async () => {
  // Mock file object
  const mockFile = new File(['dummy content'], 'dummy.pdf', { type: 'application/pdf' });

  // Mocking Axios POST request
  axios.post.mockResolvedValue({ data: 'File uploaded successfully' });

  // Render the component
  render(<Tester />);

  // Simulate file upload
  const uploadInput = screen.getByTestId('upload-input');
  fireEvent.drop(uploadInput, { dataTransfer: { files: [mockFile] } });

  screen.debug();

  // Wait for the file upload process to finish
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      'http://localhost:8000/fileUpload',
      expect.any(FormData), // Ensure FormData is sent
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: expect.any(Function),
      })
    );
  });

  
});

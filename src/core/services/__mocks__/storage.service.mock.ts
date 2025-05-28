export class MockStorageService {
  create = jest.fn();
  saveText = jest.fn();
  get = jest.fn().mockReturnValue({ answer: 'Cached answer', status: 'complete' });
  clear = jest.fn();
}

/* EXCEPTIONS */
export const TaskMessages = {
  NOT_FOUND: (id: string) => `Task with ID ${id} not found`,
  CREATE_ERROR: 'Task creation error',
  FETCH_ERROR: 'Task fetch error',
  UPDATE_ERROR: 'Task update error',
  DELETE_ERROR: 'Task deletion error',
  DELETE_SUCCESS: 'Task deleted successfully',
};

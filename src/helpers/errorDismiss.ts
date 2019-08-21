export function checkIfErrorDismissable(error: Error) {
  const dismissableMessages = [
    'message to edit not found',
    'reply message not found',
    'message is not modified',
    'MESSAGE_ID_INVALID',
    'Too Many Requests',
    'wrong file id',
    'End of file',
    'Gateway',
    'message not found',
    'bot was blocked',
  ];
  return dismissableMessages.includes(error.message);
}

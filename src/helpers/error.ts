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
  let dismissable = false;
  dismissableMessages.forEach(message => {
    if (error.message.indexOf(message) > -1) {
      dismissable = true;
    }
  });
  return dismissable;
}

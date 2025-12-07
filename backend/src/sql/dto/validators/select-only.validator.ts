import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsSelectOnly(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSelectOnly',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          const trimmedQuery = value.trim().toUpperCase();
          if (!trimmedQuery.startsWith('SELECT ')) {
            return false;
          }
          const forbiddenCommands = [
            'INSERT',
            'UPDATE',
            'DELETE',
            'DROP',
            'ALTER',
            'CREATE',
            'EXEC',
            'TRUNCATE',
          ];
          const hasForbidden = forbiddenCommands.some((cmd) =>
            trimmedQuery.includes(cmd),
          );
          return !hasForbidden;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Query must be a SELECT statement only. No INSERT, UPDATE, DELETE, etc. allowed.';
        },
      },
    });
  };
}

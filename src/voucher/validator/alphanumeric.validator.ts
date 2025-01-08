import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, registerDecorator, ValidationOptions } from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsAM implements ValidatorConstraintInterface { //this interface defines the contract that every custom validator must follow
    //2 key methods that needs to be implemented-> validate and default message

    //this is actual validation logic
  validate(value: string, args: ValidationArguments): boolean {
    const regex = /^[a-zA-Z0-9]+$/; //^ & $ what are they?
    return typeof value === 'string' && regex.test(value);
  }

  //when validationj fails, then this error message is returned
  defaultMessage(args: ValidationArguments): string {
    return 'The voucher code must be alphanumeric and contain only letters and numbers.';
  }
}

export function IsAlphaNumeric(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({ // allows custom validation logic in a similar way as isString() validator in class-validator
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsAM,
    });
  };
}

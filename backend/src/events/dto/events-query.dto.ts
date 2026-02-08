import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  registerDecorator,
  type ValidationArguments,
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
} from 'class-validator';
import {
  EVENT_LEVELS,
  type EventLevel,
  type SortDirection,
  type SortField,
} from '../events.types';

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const normalizeDateOnly = (value?: string): string | undefined => {
  if (!value) {
    return undefined;
  }
  const candidate = value.includes('T') ? value.slice(0, 10) : value;
  return DATE_ONLY_PATTERN.test(candidate) ? candidate : undefined;
};

const toUtcDate = (value?: string): Date | undefined => {
  const normalized = normalizeDateOnly(value);
  if (!normalized) {
    return undefined;
  }
  const [year, month, day] = normalized.split('-').map(Number);
  if (!year || !month || !day) {
    return undefined;
  }
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
};

@ValidatorConstraint({ name: 'isDateOnlyOrIso', async: false })
class IsDateOnlyOrIsoConstraint implements ValidatorConstraintInterface {
  validate(value: string | undefined): boolean {
    if (!value) {
      return true;
    }
    return Boolean(normalizeDateOnly(value));
  }

  defaultMessage(args: ValidationArguments): string {
    return `"${args.property}" must be a valid date-only (YYYY-MM-DD) or ISO timestamp`;
  }
}

function IsDateOnlyOrIso(
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyKey.toString(),
      options: validationOptions,
      validator: IsDateOnlyOrIsoConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'isAfterOrEqualTo', async: false })
class IsAfterOrEqualToConstraint implements ValidatorConstraintInterface {
  validate(value: string | undefined, args: ValidationArguments): boolean {
    const [relatedPropertyName] = args.constraints as [string];
    const relatedValue = (args.object as Record<string, unknown>)[
      relatedPropertyName
    ] as string | undefined;

    if (!value || !relatedValue) {
      return true;
    }

    const valueDate = toUtcDate(value);
    const relatedDate = toUtcDate(relatedValue);

    if (!valueDate || !relatedDate) {
      return false;
    }

    return valueDate.getTime() >= relatedDate.getTime();
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyName] = args.constraints as [string];
    return `"${args.property}" must be greater than or equal to "${relatedPropertyName}"`;
  }
}

function IsAfterOrEqualTo(
  relatedPropertyName: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    registerDecorator({
      target: target.constructor,
      propertyName: propertyKey.toString(),
      constraints: [relatedPropertyName],
      options: validationOptions,
      validator: IsAfterOrEqualToConstraint,
    });
  };
}

export class EventsQueryDto {
  @IsOptional()
  @IsString()
  @IsDateOnlyOrIso()
  from?: string;

  @IsOptional()
  @IsString()
  @IsDateOnlyOrIso()
  @IsAfterOrEqualTo('from', {
    message: '"to" must be greater than or equal to "from"',
  })
  to?: string;

  @IsOptional()
  @Transform(({ value }) => value?.toUpperCase())
  @IsIn(EVENT_LEVELS)
  minLevel?: EventLevel;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;

  @IsOptional()
  @IsString()
  @IsIn(['level', 'message', 'timestamp'] as SortField[])
  sortBy?: SortField;

  @IsOptional()
  @Transform(({ value }) => value?.toLowerCase())
  @IsIn(['asc', 'desc'] as SortDirection[])
  sortDir?: SortDirection;
}

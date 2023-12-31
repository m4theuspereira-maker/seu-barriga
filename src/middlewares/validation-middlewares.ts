import { NextFunction, Request, Response } from "express";
import Joi from "joi";

interface IValidator {
  params?: Joi.Schema;
  query?: Joi.Schema;
  body?: Joi.Schema;
}

export class Validator {
  static schema: IValidator;

  static validate(
    req: Request,
    res: Response,
    next: NextFunction,
    schema: IValidator
  ) {
    return this.makeValidation(req, res, next, schema);
  }

  static makeValidation(
    req: any,
    res: Response,
    next: NextFunction,
    schema: any
  ) {
    const errors: any[] = [];

    Object.keys(schema).map((k) => {
      const { error } = schema[k].validate(req[k]);

      if (error) errors.push({ type: `${k} validation`, error: error.message });

      return k;
    });

    if (errors.length === 0) {
      return next();
    }

    return res.status(400).send({ message: "Validation Error", errors });
  }
}

export class ValidationMiddlewares extends Validator {
  static checkoutPayment = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const schema = {
      body: Joi.object({
        meuIP: Joi.string().allow(""),
        dados: Joi.object(),
        deliveryInformation: Joi.object({
          firstName: Joi.string().required(),
          lastName: Joi.string().required(),
          country: Joi.string().required(),
          city: Joi.string().required(),
          streetHouseNumber: Joi.string().required(),
          houseType: Joi.string().allow(""),
          state: Joi.string().required(),
          zipCode: Joi.string().required(),
          phone: Joi.string().required(),
          emailAddress: Joi.string().required(),
          additionalInformation: Joi.string().allow("")
        })
      })
    };

    return this.validate(req, res, next, schema);
  };
}

import { validationResult } from "express-validator";

export const validateReqData = async (req: Request) => {
  const validatorRes: any = await validationResult(req);
  if (validatorRes.isEmpty()) {
    return { message: "valid", validatorRes };
  } else {
    return { message: "not valid", validatorRes };
  }
};

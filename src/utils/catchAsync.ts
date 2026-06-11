import { TResponse } from "@/src/types";

export const catchAsync = async <T>(
  fn: () => Promise<TResponse<T>>,
  customSuccessMsg?: string,
  customErrMsg?: string,
) => {
  try {
    const result = await fn();

    if (result.success) {
      return {
        success: true,
        statusCode: result.statusCode,
        data: result.data,
        message: result.message || customSuccessMsg,
        meta: result.meta,
      };
    }

    return {
      success: false,
      statusCode: result.statusCode,
      data: result,
      message: result.message || customErrMsg || "Something went wrong!",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error?.response?.data || error);

    return {
      success: false,
      statusCode: error?.response?.status,
      data: error?.response?.data || null,
      message:
        error?.response?.data?.message ||
        error?.message ||
        customErrMsg ||
        "Something went wrong!",
    };
  }
};

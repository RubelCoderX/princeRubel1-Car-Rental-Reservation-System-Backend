export type TErrorSources = {
  path: string | number;
  message: string;
}[];
export type TErrorGenericResponse = {
  statusCode: number;
  message: string;
  errorSource: TErrorSources;
};

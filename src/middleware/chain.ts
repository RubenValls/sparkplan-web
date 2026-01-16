import { NextRequest, NextResponse } from "next/server";

export type MiddlewareFunction = (
  request: NextRequest
) => NextResponse | Promise<NextResponse>;

export type MiddlewareFactory = (
  next: MiddlewareFunction
) => MiddlewareFunction;

export function chain(
  factories: MiddlewareFactory[]
): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest) => {
    const executeMiddleware = (index: number): MiddlewareFunction => {
      if (index >= factories.length) {
        return () => NextResponse.next();
      }

      const factory = factories[index];
      const nextMiddleware = executeMiddleware(index + 1);
      return factory(nextMiddleware);
    };

    const middleware = executeMiddleware(0);
    return middleware(request);
  };
}
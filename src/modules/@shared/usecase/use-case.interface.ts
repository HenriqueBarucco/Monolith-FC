/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface UseCaseInterface {
  execute(input: any): Promise<any>
}

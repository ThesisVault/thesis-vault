
export abstract class BaseController<IRequest, IResponse> {
	public abstract executeImpl(request: IRequest): Promise<IResponse>;
	
	public ok(data: IResponse) {
		return data;
	}
}

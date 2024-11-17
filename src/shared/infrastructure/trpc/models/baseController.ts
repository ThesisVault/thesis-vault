
export abstract class BaseController<IRequest, IResponse> {
	protected abstract executeImpl(request: IRequest): Promise<IResponse>;
	
	public async execute(request: IRequest): Promise<IResponse> {
		return await this.executeImpl(request);
	}
	
	public ok(data: IResponse) {
		return data;
	}
}

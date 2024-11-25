export class Result<T> {
	public isSuccess: boolean;
	public isFailure: boolean;
	private readonly _error: string | null;
	private readonly _value: T | null;

	public constructor(isSuccess: boolean, error?: string | null, value?: T) {
		if (isSuccess && error) {
			throw new Error("InvalidOperation: A result cannot be successful and contain an error");
		}
		if (!isSuccess && !error) {
			throw new Error("InvalidOperation: A failing result needs to contain an error message");
		}

		this.isSuccess = isSuccess;
		this.isFailure = !isSuccess;
		this._error = error ? error : null;
		this._value = value ?? null;

		Object.freeze(this);
	}

	public getValue(): T {
		if (!this.isSuccess || !this._value) {
			throw new Error("Can't get the value of an error result. Use 'getErrorValue' instead.");
		}

		return this._value;
	}

	public getErrorMessage(): string | null {
		return this._error;
	}

	public static ok<U>(value?: U): Result<U> {
		return new Result<U>(true, null, value);
	}

	public static fail<U>(message: string): Result<U> {
		return new Result<U>(false, message);
	}

	public static combine(results: Result<any>[]): Result<any> {
		for (const result of results) {
			if (result.isFailure) return result;
		}
		return Result.ok();
	}
}

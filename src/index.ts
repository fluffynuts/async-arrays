type AsyncReduceCallback<TAccumulator, TItem> = (acc: TAccumulator, cur: TItem) => Promise<TAccumulator>;
interface Array<T> {
    reduceAsync<TAccumulator>(
        callbackFn: AsyncReduceCallback<TAccumulator, T>,
        accumulator: TAccumulator
    ): Promise<TAccumulator>

    reduceAsync(
        callbackFn: AsyncReduceCallback<T, T>,
        accumulator?: T
    ): Promise<T>
}

interface Promise<T extends Array<any | any[]>> {
    reduceAsync<TItem>(
        callbackFn: AsyncReduceCallback<T, TItem>,
        accumulator: T
    ): Promise<T>;

    // reduceAsync(
    //     callbackFn: AsyncReduceCallback<T, T>,
    //     accumulator?: T
    // ): Promise<T>;
}

async function reduceAsync<TAccumulator, TItem>(
    this: Array<TItem>,
    callbackFn: Function, seed: any): Promise<TAccumulator> {
    if (seed === undefined) {
        // TODO: regular reduce behavior is to use the first item as the seed and start from
        // an offset of 1
    }
    let accumulator = seed;
    for (let item of this) {
        accumulator = await callbackFn(accumulator, item);
    }
    return accumulator;
}

Array.prototype.reduceAsync = reduceAsync;

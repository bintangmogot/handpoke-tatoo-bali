declare module 'midtrans-client' {
  type SnapOptions = {
    isProduction: boolean;
    serverKey: string | undefined;
    clientKey?: string;
  };

  type SnapTransaction = {
    token: string;
    redirect_url: string;
  };

  const midtransClient: {
    Snap: new (options: SnapOptions) => {
      createTransaction(parameter: Record<string, unknown>): Promise<SnapTransaction>;
    };
    CoreApi: new (options: SnapOptions) => {
      transaction: {
        status(orderId: string): Promise<Record<string, unknown>>;
      };
    };
  };
  export default midtransClient;
}

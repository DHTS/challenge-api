interface IProducts {
    sys: {
        type: string;
    };
    total: number;
    skip: number;
    limit: number;
    items: IProduct[];
}

interface IProduct {
    metadata: IMetadata;
    sys: IProductSys;
    fields: IProductFields;
}

interface IMetadata {
    tags: [];
    concepts: [];
}

interface IProductSys {
    space: { sys: [] };
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    environment: { sys: [] };
    publishedVersion: number;
    revision: number;
    contentType: { sys: [] };
    locale: string;
}

interface IProductFields {
    sku: string;
    name: string;
    brand: string;
    model: string;
    category: string;
    color: string;
    price: number;
    currency: string;
    stock: number;
}

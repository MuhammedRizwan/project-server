

export interface Icategory{
    _id?:string,
    category_name:string,
    description:string,
    image:string,
    is_block?:boolean
}

export interface CategoryRepository {
    createCategory(category: Icategory): Promise<Icategory | null>;
    findByCategoryName(category_name: string): Promise<Icategory | null>;
    blockNUnblockCategory(
      id: string,
      is_block: boolean
    ): Promise<Icategory | null>;
    findAllCategory(query:object,page:number,limit:number,filterData:object): Promise<Icategory[]>;
    editCategory(id: string, catagory: Icategory): Promise<Icategory | null>;
    countDocument(query:object,filterData:object): Promise<number>;
    findCategoryById(id: string): Promise<Icategory | null>;
    getUnblockedCategories(): Promise<Icategory[] | null>;
  }
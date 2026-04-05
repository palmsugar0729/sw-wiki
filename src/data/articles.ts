export interface Article {
    id: number
    title: string
    content: string
  }
  export interface Country {
    id: number
    countryChineseName: string
    countryEnglishName: string
    images: string
    shortContents: string
    territory?: string
    history?: string
    polity?: string
    military?: string
    tags: string[]
  }
  
  export const articles: Article[] = [
    { id: 1, title: "首页", content: "# 欢迎\n这是 SW-WIKI" },
    { id: 2, title: "世界观", content: "# 世界观\n设定内容" }    
  ]
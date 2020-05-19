import React from "react"

const MainContext = React.createContext()

class ShoppingItem{
    key = 'NN_0'
    COM_TYPE_ID='NN'
    ITEM_ID=0
    ITEM_NAME='KNOW'
    ITEM_NUMBER=0
    PRICE_SELECT = 1 // 默认价格选择，为会员价格
    PRICE_ARR=[
            0,
            0,
            0,
            0
        ]
    PRICE_SUBTOTAL = 0
    

    InitShoppingItem(iteminfo, itemCount, count = 1){
        this.key = iteminfo.key + '_' + itemCount.toString()
        this.COM_TYPE_ID = iteminfo.COM_TYPE_ID
        this.ITEM_ID = iteminfo.ITEM_ID
        this.ITEM_NAME = iteminfo.ITEM_NAME
        this.ITEM_NUMBER = count
        this.PRICE_SELECT = 2   // 默认选择团购价格
        
        this.PRICE_ARR = [
            iteminfo.ITEM_PRICE,
            iteminfo.ITEM_MEM_PRICE,
            iteminfo.ITEM_GROUP_PRICE,
            iteminfo.ITEM_DEPOSIT_PRICE
        ]
        this.PRICE_SUBTOTAL = this.PRICE_ARR[this.PRICE_SELECT] * this.ITEM_NUMBER
    }
}
export {ShoppingItem}
export {MainContext}
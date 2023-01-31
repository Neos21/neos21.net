---
title        : コードのネストを深くしない
created      : 2020-11-17
last-modified: 2020-11-17
path:
  - /index.html Neo's World
  - /tech/index.html Tech
  - /tech/programming/index.html プログラミング
---

コードのネストを深くしない。浅く保つ。具体的には、1つの関数で条件分岐やループによるネストは多くて3つまでに保ち、4つ・5つ以上にはしない。


## ネストが浅いことによるメリット

- 1つの関数のネストが浅いということは、条件分岐やループ処理が少なく、処理・状態が追いやすくなるということ
- 適切に関数を分割していれば、各関数を読む時は最低限の前提知識・前提条件だけ押さえておけば読めるようになるし、処理全体を追う時は各関数の詳細な処理について知らなくても読めるようになる


## ネストが深いことによるデメリット

- ネストが深くなるということは、それだけ「特定の条件に合致する」から深くなる。つまり、覚えておかないといけない前提条件、状態などの情報が増えることになる
  - 例 : 「注文処理」メソッドの中で、ステータス「受注済」の場合の処理があり、「発注キャンセル」フラグと「返金状況」ステータスを加味して「キャンセル金額」を集計して…などとなると、そのコードを読む時に覚えておかないといけない前段が多すぎる
- 覚えておくことが多いと、勘違いや読み間違いをしやすいし、改修時も影響調査が困難になる


## コードで例

でっち上げたコードなのでなかなか良さが伝わらないかも知れないが…。

- 悪いコード

```javascript
/**
 * 注文処理
 * 
 * @param productName 商品名
 * @param price 商品単価
 * @param quantity 注文数量
 */
function order(productName, price, quantity) {
  // 売り切れチェック用変数
  let isSoldOut = false;
  // 在庫不足チェック用変数
  let isShortage = false;
  
  // 全商品情報を取得する
  const products = StockService.searchProducts();
  // 全商品情報をループする
  for(let i = 0; i < products.length; i++) {
    const product = products[i];
    // 注文された商品の場合
    if(product.name === productName) {
      // 注文された商品の在庫が0個だった場合
      if(product.stock === 0) {
        // 売り切れフラグを設定する
        isSoldOut = true;
      }
      // 注文数より在庫数が少なかった場合
      else if(product.stock < quantity) {
        // 在庫不足フラグを設定する
        isShortage = true;
      }
    }
  }
  
  // 売り切れ・在庫不足でなければ注文処理を行う
  if(!isSoldOut && !isShortage) {
    // 注文処理未完了フラグ
    let isIncompleted = false;
    
    // 1商品1品ずつ注文処理を実行する
    for(let i = 0; i < quantity; i++) {
      try {
        const orderResult = OrderService.orderProduct(productName);
        // 結果が false の場合はエラーにする
        if(!orderResult) {
          throw new Error('注文失敗');
        }
      }
      catch(orderError) {
        // 注文処理が上手くいかなかった場合は未完了フラグを設定する
        isIncompleted = true;
      }
      
      if(!isIncompleted) {
        // 注文処理ができたら売上金額データを設定する (こんなビジネスロジックがあるかはともかく…w)
        try {
          const salesResult = SalesService.postingSales(productName, price);
          // 結果が false の場合はエラーにする
          if(!salesResult) {
            throw new Error('売上金額計上失敗');
          }
        }
        catch(salesError) {
          // 売上金額の計上が失敗したら未完了フラグを設定する
          isIncompleted = true;
        }
      }
    }
    
    // 最終的にエラーがあれば表示する
    if(isIncompleted) {
      alert('注文処理に失敗しました');
    }
    else {
      alert('注文が完了しました');
    }
  }
  else {
    if(isSoldOut) {
      alert('商品が売り切れです');
    }
    else {
      alert('商品の在庫が足りません');
    }
  }
}
```

トランザクション処理がそれでいいの、とか、例外処理の仕方が雑、とか、指摘は色々あるだろうけど、某所で見たことのある作りを再現してみた。今回は「ネスト」という点だけで改善してみようと思う。

このコードの「ネスト」に関する問題点は以下のとおり。

- 早めに `return` して抜ければ良いところを抜けていない
- 在庫チェックと注文処理という、異なるタスクを1つの関数でやろうとしている
- フラグ変数が多く、状態が分かりづらい (特に「売り切れ」「在庫不足」の時のエラーメッセージを出力するまでの処理に余計な条件分岐が多い)

ネストを浅くするには、以下のように考える。

- 異常系は早めに検知して `return` する (ガード句)。「ネストが浅いところは正常系」として読めるようにする
- 異なる処理は別関数に切り出して、呼び出しだけで終わるようにする
- 基礎的な `for` 文は `forEach()` 関数を利用するなどして、制御構文が減らせないか工夫する

上述のコードだと、こんな風に変えられると思う。

- 改善したコード

```javascript
/**
 * 注文処理
 * 
 * @param productName 商品名
 * @param price 商品単価
 * @param quantity 注文数量
 */
function order(productName, price, quantity) {
  // 売り切れ・在庫不足の場合はエラーメッセージを表示して終了する
  if(isSoldOut(productName)) {
    alert('商品が売り切れです');
    return;
  }
  else if(isShortage(productName, quantity)) {
    alert('商品の在庫が足りません');
    return;
  }
  
  // 注文・売上金額計上処理を実行する
  try {
    execOrderPosting(productName, price, quantity);
  }
  catch(error) {
    alert('注文処理に失敗しました');
  }
  
  alert('注文が完了しました');
}

/**
 * 商品が売り切れかどうかを返す
 * 
 * @param productName 商品名
 * @return 商品が売り切れの場合は true を返す
 */
function isSoldOut(productName) {
  return getStocks(productName) === 0;
}

/**
 * 商品の在庫数が不足しているかどうかを返す
 * 
 * @param productName 商品名
 * @return 在庫不足の場合は true を返す
 */
function isShortage(productName, quantity) {
  return getStocks(productName) < quantity;
}

/**
 * 商品の在庫数を返す
 * 
 * @param productName 商品名
 * @return 在庫数
 */
function getStocks(productName) {
  return StockService.searchProducts().filter((product) => {
    return product.name === productName;
  }).stock;
}

/**
 * 商品の注文・売上金額計上処理を行う
 * DB 操作に失敗した場合は SQLError を、処理に失敗した場合は業務例外を投げる
 * 
 * @param productName 商品名
 * @param price 商品単価
 * @param quantity 注文数量
 * @throws 注文失敗エラー or 売上金額計上失敗エラー or SQLError
 */
function execOrderPosting(productName, price, quantity) {
  for(let i = 0; i < quantity; i++) {
    OrderService.orderProduct(productName) || throw new Error('注文失敗');
    SalesService.postingSales(productName, price) || throw new Error('売上金額計上失敗');
  }
}
```

- 大本の `order()` メソッドを、各メソッドの呼び出しのみにした
- 事前にエラーチェックを行い、エラーを見つけ次第 `return` するようにした
- `isSoldOut()` と `isShortage()` はメソッド化し、内部処理は更に `getStocks()` と切り出した (メソッドの共通化。実際はこれらの業務ロジックをまとめたクラスがあると良い)
- `getStocks()` は、`for` 文と `if` 文を利用していたところを `filter()` に変えて簡素化した (実際は、`filter()` で1件も合致しなかった場合など例外処理は必要)
- `execOrderPosting()` は、別クラスの処理結果が `boolean` なので、`orderResult` や `salesResult` といった変数を設けず、`||` OR 演算子で処理した。関数としては思い切って例外を Throw する前提の関数とした (ココは本来トランザクション処理をきちんとすべきなのだが今回のネストとは別の話、ということで)

このようにすると、ネストの深さを2段階以上にせずに済ませられている。`order()` 関数を読む時は、呼び出す各関数でどんなことをしているか細かく知らなくとも全体が見通せるようになるし、各メソッドを見た時に覚えておかないといけないことが少なくて済む。

- 参考 : [anopara - コードのネストを深くするな](http://anopara.net/2014/06/27/do-not-write-deep-nested-code/)

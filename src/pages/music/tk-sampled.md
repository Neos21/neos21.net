---
title        : 角松敏生 元ネタ探し
created      : 2022-03-10
last-modified: 2022-03-11
path:
  - /index.html Neo's World
  - /music/index.html Music
head: |
  <style>
    .table-wrapper {
      overflow-x: auto;
    }
    
    .table-wrapper table {
      margin: 0;
      min-width: 100%;
      white-space: nowrap;
    }
    
    .note {
      font-size: var(--font-size-small);
    }
  </style>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // 検索クエリ用の文字列に置換する
      const convertToQueryText = (text) => text.replace(/ /gu, '+').replace(/&/gu, '%26').replace(/\//gu, '%2F').replace(/'/gu, '%27');
      // YouTube リンクを組み立てる : 第2引数 queryText がなければ第1引数 labelText の値を利用する
      const createYouTubeLink  = (labelText, queryText) => `<a href="https://www.youtube.com/results?search_query=${convertToQueryText(queryText ?? labelText)}" target="_blank">${labelText}</a>`;
      // Google リンクを組み立てる
      const createGoogleLink   = (queryText) => `<span class="note">(<a href="https://www.google.com/search?q=${convertToQueryText(queryText)}" target="_blank">検索</a>)</span>`;
      
      // テーブルのデータ行を処理する
      const rows = document.querySelectorAll('#tk-sampled-table.table-wrapper > table > tbody > tr');
      rows.forEach((row) => {
        try {
          const columns = row.querySelectorAll('td');
          
          // 「曲名」列
          const songNameText = columns[0].innerText;
          
          // 「曲名」列にハイフンが含まれる場合は「角松敏生プロデュース作品」とし、ハイフン手前をアーティスト名とみなす
          const songNameTextMatches = songNameText.match(/^(.*) - (.*)$/);
          const artistName = songNameTextMatches?.[1] ?? '角松敏生';
          const songName   = songNameTextMatches?.[2] ?? songNameText;
          
          // 「曲名」列を YouTube 検索リンクにし、後ろに Google 検索リンクを追加する
          const songNameForQuery = `${artistName} ${songName}`;
          const afterSongNameHTML = `${createYouTubeLink(songNameText, songNameForQuery)} ${createGoogleLink(songNameForQuery)}`;
          
          // 「収録シングル・アルバム名」列
          const albumNamesText = columns[1].innerText;
          // 複数ある場合は br 要素で改行しているので改行 = 1アルバムごとに処理する
          const afterAlbumNames = albumNamesText.split('\n').map((albumNameAndYear) => {
            const matches = albumNameAndYear.match(/^([0-9]{4}) (.*)$/);
            const year      = matches[1];
            const albumName = matches[2];
            const albumNameForQuery = `${artistName} ${albumName}`;
            return `${year} ${createYouTubeLink(albumName, albumNameForQuery)} ${createGoogleLink(albumNameForQuery)}`;
          });
          const afterAlbumNamesHTML = afterAlbumNames.join('<br>');
          
          // 「元ネタ」列
          const samplesText = columns[2].innerText;
          // 複数ある場合は br 要素で改行しているので改行 = 1曲ごとに処理する
          const afterSamples = samplesText.split('\n').map((sampleText) => {
            const sampleForQuery = sampleText.replace(' - ', ' ');
            return `${createYouTubeLink(sampleText, sampleForQuery)} ${createGoogleLink(sampleForQuery)}`;
          });
          const afterSamplesHTML = afterSamples.join('<br>');
          
          // 全列問題なければ HTML 置換する
          columns[0].innerHTML = afterSongNameHTML;
          columns[1].innerHTML = afterAlbumNamesHTML;
          columns[2].innerHTML = afterSamplesHTML;
        }
        catch(error) {
          console.error('HTML 置換に失敗', error);
        }
      });
    });
  </script>
---

<q>〜新鮮保証56.5.10迄〜</q> でおなじみ (？)、僕が大好きな角松敏生の楽曲の「元ネタ」を探してみました。リンクは YouTube の検索ページに飛ぶ他、「(検索)」は Google 検索へのリンクとしているので、実際の楽曲を聴き比べてみてください。

<div id="tk-sampled-table" class="table-wrapper">

| 曲名 | 収録シングル・アルバム名 | 元ネタ |
|------|--------------------------|--------|
| Dancing Shower | 1981 Sea Breeze<br>2016 Sea Breeze 2016 | Stuff - Foots |
| Elena | 1981 Sea Breeze<br>2016 Sea Breeze 2016 | Airplay - Nothin' You Can Do About It |
| Still I'm In Love With You | 1981 Sea Breeze<br>1985 T's Ballad<br>2016 Sea Breeze 2016 | Airplay - It Will Be Alright |
| Rush Hour | 1982 Weekend Fly To The Sun<br>2012 Rebirth 1 | Doobie Brothers - What A Fool Believes |
| Brunch | 1982 Weekend Fly To The Sun | Al Jarreau - Breakin' Away |
| 4 A.M. | 1982 Weekend Fly To The Sun | Al Jarreau - Teach Me Tonight |
| Crescent Aventure | 1982 Friday To Sunday<br>1985 T's Ballad<br>2020 Earplay Rebirth 2 | Nite Flyte - If You Want It |
| Take Me Far Away | 1983 On The City Shore<br>2003 君のためにできること | High Fashion - I Want To Be Your Everything |
| It's Hard To Say Good-Bye | 1983 Do You Wanna Dance<br>1986 T's 12 Inches | Narada Michael Walden - Never Wanna Be Without Your Love |
| If You... | 1984 After 5 Clash | High Fashion - Feelin' Lucky Lately |
| Maybe It's Love Affair | 1984 After 5 Clash | Carol Douglas - My Simple Heart |
| Will You Wait For Me | 1984 After 5 Clash | Airplay - It Will Be Alright |
| Step Into The Light | 1984 After 5 Clash<br>1984 Girl In The Box<br>1986 T's 12 Inches | Unique - What I Got Is What You Need<br>Armenta & Majik - I Wanna Be With You |
| Never Touch Again | 1984 After 5 Clash | Armenta & Majik - I Wanna Be With You |
| Girl In The Box | 1984 Girl In The Box<br>1986 T's 12 Inches<br>1993 1981-1987<br>2012 Rebirth 1 | Change - Paradise<br>Luther Vandross - Never Too Much |
| Springin' Night | 1985 Gold Digger | Titus Williams - Give Me Some Love Tonight |
| Secret Lover | 1985 Gold Digger<br>1985 Tokyo Tower | Hey DJ - World's Famous Supreme Team |
| 初恋 | 1985 初恋 / Snow Lady Fantasy<br>1986 T's 12 Inches | M'Lady - Baby You Lied<br>Alton McClain & Destiny - It Must Be Love |
| Lucky Lady Feel So Good | 1986 Lucky Lady Feel So Good<br>1986 Pile Driver<br>1986 T's 12 Inches | Tululah Moon - If You Want Love<br>Luther Vandross - She's a Superlady |
| Take Off Melody | 1986 Touch And Go<br>1986 T's 12 Inches | Billy Crystal - You Look Marvelous |
| Pile Driver | 1986 Pile Driver<br>1986 Touch And Go<br>1986 T's 12 Inches | System - I Don't Run From Danger |
| ドアの向こう | 1986 ドアの向こう<br>1993 1981-1987 | Chapter 8 - How Can I Get Next To You |
| 中山美穂 - Rising Love | 1986 Summer Breeze | Total Contrast - Takes A Little Time<br>Total Contrast - Hit And Run |
| This Is My Truth | 1987 This Is My Truth<br>1993 1981-1987 | System - Come As You Are Superstar |
| She's My Lady | 1987 She's My Lady<br>1993 1981-1987 | Luther Vandross - She's a Superlady |
| Jadoes - Shining You | 1987 Free Drink | Change - Change Of Heart |
| Jadoes - Step Into The City Light | 1988 Step Into The City Light / Days Gone By<br>1989 Dumpo<br>1994 J's Hot | Scritti Politti - Perfect Way |
| Okinawa | 1989 Reasons For Thousand Lovers<br>1989 Okinawa<br>2000 1988-1993 | System - Don't Disturb This Groove |
| I Must Change My Life & Love For Me | 1990 I Must Change My Life & Love For Me<br>2000 1988-1993 | Chaka Khan - What Cha' Gonna Do For Me |
| 夜離れ | 1991 All Is Vanity | Steely Dan - Home At Last |
| Aki - ふりむかないで Don't Look Back | 1996 ふりむかないで Don't Look Back | Love To Infinity - Keep Love Together |
| 吉沢梨絵 - Never Gonna Miss You | 1997 Vocaland Never Gonna Miss You | Change - Say You Love Me Again |
| Time Tunnel | 1999 Time Tunnel | Yes - Close To The Edge |
| 心配 | 2001 心配 / Yokohama Twilight Time<br>2011 1998-2010 | David Foster - Love At Second Sight<br>David Foster - Chaka |
| Views | 2004 Fankacoustics | Zinc - Street Level |

</div>

- T's 12 Inches のアルバムジャケット → Level 42 の Pursuit Of Accidents のアルバムジャケット

僕はこれらの類似を、パクリ・盗作といったネガティブな捉え方はしていません。いずれも、元ネタにリスペクトを込めた意図的なオマージュであると認識しています。元ネタのミュージシャンを呼び寄せて製作している楽曲も多く、なんなら「公認」で真似ている、といえます。さらに、いずれの楽曲も「角松敏生らしさ」という唯一無二の明確なオリジナリティがあり、元ネタを超えるクオリティへと昇華させていることからも、単なる真似っこに留まらないことは一聴して分かることでしょう。

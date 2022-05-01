let news =[];
let page =1;
let total_pages =0;
let menus = document.querySelectorAll(".menus button")
menus.forEach(menu=> menu.addEventListener("click", (event)=>getNewsByTopic(event)))

let searchButton = document.getElementById("search-button");

// 각 함수에서 필요한 url을 만든다
let url;


// api호출 함수를 부른다
const getNews = async () => {
    try{
        let header = new Headers({'x-api-key':'yWuzhIzcXnixAqL2gEI0cUUV7bHwu08Slhg8sS-zURw'})
        url.searchParams.set('page',page); // = &page=
        console.log("url은?",url)

        let response = await fetch(url,{headers:header}) //ajax, http, fetch
        let data = await response.json();

        if(response.status == 200) {
            if(data.total_hits == 0) {
                throw new Error("검색된 결과 값이 없습니다.")
            }
            console.log("받는 데이터가 뭐지", data)

            news = data.articles;

            total_pages = data.total_pages;
            page=data.page;
            console.log(news);

            render();

            pageNation();

        }else {
            throw new Error(data.message)
        }
    }catch (error){
        console.log("잡힌 에러는", error.message)
        errorRender(error.message);
    }

};

const getLatestNews = async () => {
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=business&page_size=10`)
    //new URL url에 관해서 분석해줌
    console.log(url)

    getNews()

};

const getNewsByTopic = async (event) =>{
    console.log("클릭됨", event.target.textContent)
    let topic = event.target.textContent.toLowerCase();

    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`)

    getNews()

}
const getNewsByKeyword =async () =>{
    //1. 검색 키워드 읽어오기
    //2. url에 검색 키워드 붙이기
    //3. 헤더준비
    //4. url 부르기
    //5. 데이터 가져오기
    //6. 데이터 보여주기

    let keyword = document.getElementById("search-input").value
   url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`)

    getNews()

}

const render =()=>{
    let newsHTML = ''
    newsHTML= news.map((item)=>{
        return `<div class="row news">
            <div class="col-lg-4">
                <img class="news-img-size" src="${item.media}"/>
            </div>
            <div class="col-lg-8">
                <h2>${item.title}</h2>
                <p>
                   ${item.summary}
                </p>
                <div>
                   ${item.rights} * ${item.published_date}
                </div>
            </div>
        </div>`
    }).join('');

    document.getElementById("news-board").innerHTML=newsHTML;
}

const errorRender = (message) => {
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">
    ${message}</div>`;
    document.getElementById("news-board").innerHTML=errorHTML;
}


const pageNation =() => {
    let pagenationHTML =``;
    //total_page
    //page(현재)
    //page group
    let pageGroup = Math.ceil(page/5)
    //last

    let last = pageGroup * 5
    //first
    let first = last - 4
    //first~last 페이지 프린트



    //total page = 3 일때, 마지막은 5가 아닌 3임 이런 경우엔 어떻게 함?
    //last / first의 규칙
    // << >> 이 버튼 만들어 주기
    // 내가 마지막 그룹일때, >>없고
    // 내가 그룹1일때 << 없고

if (first >=6) {
    pagenationHTML = `<li class="page-item">
      <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(1)">
        <span aria-hidden="true"> &lt;&lt; </span>
      </a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page - 1})">
        <span aria-hidden="true">&lt;</span>
      </a>
    </li>`;
}


    if(page == 1) {
        pagenationHTML=""
    }

    if(page == total_pages){
        last = total_pages;

    }


    for(let i = first; i <= last ; i++){
        pagenationHTML +=`<li class="page-item ${page==i?"active":""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`
    }

    if(last <total_pages) {
        pagenationHTML += `<li class="page-item">
      <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page + 1})">
        <span aria-hidden="true">&gt;</span>
      </a>
    </li>
    <li class="page-item">
      <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${total_pages})">
        <span aria-hidden="true"> &gt;&gt; </span>
      </a>
    </li>`;
    }



    document.querySelector(".pagination").innerHTML=pagenationHTML;
}

const moveToPage=(pageNum)=>{
    //이동하고 싶은 페이지를 알아야 함
    page = pageNum

    //이동하고 싶은 페이지를 가지고 api를 다시 호출
    getNews();

}
searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews()


// console.log(1)
// setTimeout(()=>{console.log(2)},2000)
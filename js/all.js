//指定DOM
const inputHeight = document.querySelector('.height'); //使用者身高
const inputWeight = document.querySelector('.weight'); //使用者體重
const recordList = document.querySelector('.record'); //歷史列表
const resultbtn = document.querySelector('.result'); //結果按鈕
const deleteAllbtn = document.querySelector('.delete-all') //清除全部按鈕
let data =JSON.parse(localStorage.getItem('recordData')) || []; //取出application上的資料傳回到頁面上，否則空集

const bmiData = {
    normal:{
        color: 'green',
        status: '理想'
    },
    tooThin:{
        color: 'blue',
        status: '過輕'
    },
    tooFat:{
        color: 'orange',
        status: '過重'
    },
    lightFat:{
        color: 'lightorange',
        status: '輕度肥胖'
    },
    mediumFat:{
        color: 'mediumorange',
        status: '中度肥胖'
    },
    overFat:{
        color: 'overorange',
        status: '重度肥胖'
    }
};

//頁面開啟時更新
updataRecord(data);

//計算結果，加入紀錄，並同步更新網頁與localStorage
function calculation(e){
    e.preventDefault();
    let inputHeightValue = inputHeight.value;
    let inputWeightValue = inputWeight.value;
    let bmiValue = (inputWeightValue / (inputHeightValue / 100 * inputHeightValue / 100)).toFixed(2);
    let userRecord = {};

    if(inputHeightValue == '' && inputWeightValue == '' ){
        alert('身高/體重填寫錯誤');
        inputHeight.value = '';
        inputWeight.value = '';
        return;
    }
    else if(inputWeightValue == '' || inputWeightValue <= 0 || inputWeightValue > 999)
    {
        alert('體重填寫錯誤or數值不可超過999');
        inputHeight.value = '';
        inputWeight.value = '';
        return;
    }
    else if(inputHeightValue == '' ||  inputHeightValue <= 0 || inputHeightValue > 999)
    {
        alert('身高填寫錯誤or數值不可超過999');
        inputHeight.value = '';
        inputWeight.value = '';
        return;
    }
    else
    {
        userRecord.height = inputHeightValue;
        userRecord.weight = inputWeightValue; 
        userRecord.bmi = bmiValue;
        inputHeight.value = '';
        inputWeight.value = '';
    }

    if(bmiValue < 18.5){
        userRecord.status = 'tooThin';
    }else if(bmiValue > 18.5 && bmiValue < 24){
        userRecord.status = 'normal';
    }else if(bmiValue >= 24 && bmiValue < 27){
        userRecord.status = 'tooFat';
    }else if(bmiValue >=27 && bmiValue < 30){
        userRecord.status = 'lightFat';
    }else if(bmiValue >= 30 && bmiValue < 35){
        userRecord.status = 'mediumFat';
    }else if(bmiValue >= 35){
        userRecord.status = 'overFat';
    }else{
        alert('BMI數值不正常');
    }

		userRecord.date = getDate();
  
    data.unshift(userRecord);
    updataRecord(data);
    localStorage.setItem('recordData',JSON.stringify(data));
}

//更新網頁內容
function updataRecord(items){
    str='';
    for(let i = 0; i < items.length; i++){
			let bmiStatus = items[i].status;
			str +=
			`
        <li class="${bmiData[bmiStatus].color}">
          <div>${bmiData[bmiStatus].status}</div>
          <div>
            <span>BMI</span>
            ${items[i].bmi}
          </div>
          <div>
            <span>weight</span>
            ${items[i].weight}Kg
          </div>
          <div>
            <span>height</span>
            ${items[i].height}cm
          </div>
          <span>${items[i].date}</span>
					<span>
          <a href="#"><i class="fas fa-trash-alt" data-num"${i}"></i></a>
          </span>
        </li>
      `
		}
    recordList.innerHTML = str;
}

//取得日期
function getDate(){
    let today = new Date();
    let day = '';
    let month = '';
    if(today.getDate() < 10){
        day = '0' + today.getDate();
    }else{
        day = today.getDate();
    }
    if(today.getMonth() + 1 < 10){
        month = '0' + (today.getMonth() + 1);
    }else{
        month = today.getMonth() + 1;
    }

    let year = today.getFullYear();
    let nowDate = (month + '-' + day + '-' + year);
    return(nowDate);
}

//刪除單項紀錄
function deleteRecord(e){
    e.preventDefault();
    let num = e.target.dataset.num;
    if(e.target.nodeName !== 'I'){return};
    if(confirm('確認刪除這筆紀錄嗎?')){
			data.splice(num,1);
			localStorage.setItem('recordData', JSON.stringify(data));
			updataRecord(data);
		}		
}

//刪除全部紀錄
function deleteAllRecord(e){
		e.preventDefault();
		if(confirm('確認刪除全部紀錄嗎?')){
			data = [];
			localStorage.setItem('recordData',JSON.stringify(data));
			updataRecord(data);
		}
}

//監聽
resultbtn.addEventListener('click',calculation,false);
recordList.addEventListener('click',deleteRecord,false);
deleteAllbtn.addEventListener('click',deleteAllRecord,false);

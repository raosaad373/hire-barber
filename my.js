const arr = [1,2,3,4,5,6,7,7,8,6,10];
for(var i=0; i<arr.length; i++){
for(var j=i+1; j<arr.length; j++){
    if(arr[i] == arr[j]){
    console.log(`number are ${arr[i]}`)
}
}
}
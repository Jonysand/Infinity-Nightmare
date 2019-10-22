class BGsmooth{
  constructor() {
    this.howMany = 10;
    this.readings = [];
    for(let i=0;i<this.howMany;i++){
      this.readings.push(0);
    }
    this.readIndex = 0;
    this.total = 0;
    this.average = 0;
    this.serialCount = 0;
  }
  
  getBGoffset(soundLevel) {
    this.total -= this.readings[this.readIndex];
    this.readings[this.readIndex] = soundLevel;
    this.total += this.readings[this.readIndex];
    this.readIndex++;
    if(this.readIndex>=this.howMany){
      this.readIndex = 0;
    }
    this.average = this.total/this.howMany;
    this.serialCount++;

    return (max(this.average,soundLevel)-min(this.average,soundLevel));
  }
}



//------------------------------------------
// smoothen the scale controlled by loudness
//------------------------------------------
function updateScale(tempScale, targetScale){
  let acceleration = 0.05;
  if(tempScale<targetScale){
    return tempScale+=acceleration;
  }else if(tempScale>targetScale){
    return tempScale-=acceleration;
  }else{
    return tempScale;
  }
}
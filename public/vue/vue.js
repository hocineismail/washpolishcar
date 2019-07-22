
 console.log("hello word")
 new Vue({
    el: '#content-vue',
    data: {
  
     ShowProfile: true,
  },
  
  methods: {
    
      change:  function () 
    {
       if (this.ShowProfile) {
        this.ShowProfile = false;
       } else {
        this.ShowProfile = true;
       }
       
       console.log(" clilkani bicth")
    },
   add2: function(){
  
    this.input = true;
    this.teacher = false;
    this.student = true;
   },
   add0: function(){
  console.log(" clilkani bicth")
    
   }
  },
  
  
  
  })
  
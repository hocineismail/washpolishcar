
 new Vue({
    el: '#app',
    data: {
  
     input: false,
     student: false,
     teacher: false,
    
    },
  
  methods: {
    
    add1:  function () 
    {
       
        this.input = true;
        this.teacher = true;
        this.student = false;
        console.log(this.student,this.input)
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
  
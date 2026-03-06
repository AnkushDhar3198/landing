function parent (params) {
    let c
    function child(params) {
        c = 10
        function grandChild(params) {
            console.log(c);
        }
        grandChild()
    }
    child()
}
parent()
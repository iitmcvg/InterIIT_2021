export default function process() {
    var final = []
    var ref = this.state.dir

    alert('Executing')

    if (this.state.filcol != '') {
        if (this.state.filcol === "item") {
            var subs = this.state.filval.toLowerCase()
            for (var i = 0; i < ref.length; i++) {
                if (ref[i]['name'].toLowerCase().includes(subs))
                    final.push(ref[i])
            }
            this.setState({
                dir2: final
            })
        }
        else {
            var val = parseInt(this.state.filval)
            var col = this.state.filcol
            var con = this.state.filcon

            for (var i = 0; i < ref.length; i++) {
                switch (con) {
                    case "lt":
                        if (ref[i][col] < val)
                            final.push(ref[i])
                        break;
                    case "gt":
                        if (ref[i][col] > val)
                            final.push(ref[i])
                        break;
                    case "leq":
                        if (ref[i][col] <= val)
                            final.push(ref[i])
                        break;
                    case "geq":
                        if (ref[i][col] >= val)
                            final.push(ref[i])
                        break;
                }
            }
        }
    }

    if (this.state.orderval !== '') {
        var col = this.state.ordercol
        if(final.length === 0)
            final = ref

        if (col !== "item")
            final.sort(function (a, b) { return a[col] - b[col] })
        else
            final.sort(function (a, b) { return a['name'].localeCompare(b['name']) })

        if (this.state.orderval === "desc")
            final.reverse()
    }

    this.setState({
        dir2: final
    })
    this.handleProceed()
}
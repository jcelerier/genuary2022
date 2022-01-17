import Ossia 1.0 as Ossia

Ossia.Http
{
    function createTree() {
        return [
                {
                    name: "request",
                    type: Ossia.Type.String,
                    // ex: $val == 11923601/george_sand.json
                    request: "https://data.bnf.fr/en/$val",
                    answer: function (json) {
                        console.log(json)
                        var works = JSON.parse(json)[0]["works"];
                        console.log(works);
                        let arr = [];
                        works.forEach((work, idx) => { arr.push(work.title); });
                        return [{ address: "/works", value: arr }];
                    }
                },
                {
                    name: "works",
                    type: Ossia.Type.List,
                    value: [ ]
                }
        ];
    }

    function openListening(address) { }
    function closeListening(address) { }
}

var p = {
    v1: 'v1',
    v2: 'v2',
    f1: () => {
        console.log(v1);
    },
    f2: () => {
        console.log(v2);
    }
}

p.f1();
p.f2();
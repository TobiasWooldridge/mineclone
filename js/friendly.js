var _ = {
    pushAll : function pushAll (base, ext) {
        base.push.apply(base, ext);
    },

    push3 : function pushAll (base, ext) {
        base.push(ext[0], ext[1], ext[2]);
    },

    push4 : function pushAll (base, ext) {
        base.push(ext[0], ext[1], ext[2], ext[3]);
    }
};
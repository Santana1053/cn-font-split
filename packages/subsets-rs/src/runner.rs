use crate::link_subset::link_subset;
use crate::pre_subset::name_table::NameTable;
use crate::pre_subset::pre_subset;
use crate::protos::{EventMessage, InputTemplate};
use crate::run_subset::{run_subset, RunSubsetResult};
use harfbuzz_rs_now::{Face, Owned};

pub struct Context {
    pub input: InputTemplate,
    pub pre_subset_result: Vec<Vec<u32>>,
    pub run_subset_result: Vec<RunSubsetResult>,
    pub name_table: NameTable,
    pub callback: fn(message: EventMessage) -> (),
}

pub fn font_split(config: InputTemplate, callback: fn(event: EventMessage)) {
    let mut ctx = Context {
        input: config,
        pre_subset_result: vec![],
        run_subset_result: vec![],
        name_table: NameTable { table: vec![] },
        callback,
    };
    for process in [pre_subset, run_subset, link_subset] {
        process(&mut ctx)
    }
    ()
}

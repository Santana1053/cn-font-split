use crate::link_subset::link_subset;
use crate::pre_subset::name_table::NameTableSets;
use crate::pre_subset::pre_subset;
use crate::protos::{output_report, EventMessage, InputTemplate, OutputReport};
use crate::run_subset::{run_subset, RunSubsetResult};
use prost::Message;

pub struct Context<'a> {
    pub input: InputTemplate,
    pub pre_subset_result: Vec<Vec<u32>>,
    pub run_subset_result: Vec<RunSubsetResult>,
    pub name_table: NameTableSets,
    pub callback: fn(message: EventMessage) -> (),
    pub reporter: &'a mut OutputReport,
}

pub fn font_split(config: InputTemplate, callback: fn(event: EventMessage)) {
    let mut reporter = OutputReport::default();
    let mut ctx = Context {
        input: config,
        pre_subset_result: vec![],
        run_subset_result: vec![],
        name_table: NameTableSets { table: vec![] },
        callback,
        reporter: &mut reporter,
    };
    ctx.reporter.version = "7.0.0".to_string();
    for process in [pre_subset, run_subset, link_subset] {
        process(&mut ctx)
    }

    // name_table 转 proto
    ctx.reporter.name_table = ctx.name_table.table;
    // 日志转二进制输出
    let mut reporter_buffer = Vec::new();
    ctx.reporter.encode(&mut reporter_buffer).unwrap();

    callback(EventMessage {
        event: "output_data".to_string(),
        data: Some(reporter_buffer),
        message: Some("reporter.bin".to_string()),
    });
    ()
}

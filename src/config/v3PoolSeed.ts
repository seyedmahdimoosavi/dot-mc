import type { Address } from "viem";

/**
 * Known V3 pools as of SEED_BLOCK, from a one-off full chunked scan of the
 * factory's PoolCreated history (see data/pools/v3Pools.ts).
 *
 * Ported from dotoneswap's config/v3PoolSeed.ts, but re-generated for this
 * app at a much later block: the dotoneswap seed was taken at block
 * 11,693,844 and only listed the 16 pools that existed then. Since this app
 * has no warm server process to keep a scan checkpoint alive, a stale seed
 * would mean every browser session has to re-scan millions of blocks before
 * the V3 list is complete — so the seed below was rebuilt by scanning the
 * factory from its deploy block to block 16,743,675 (28 pools, a strict
 * superset of the 16 the swap app seeds with). runScan() then only needs
 * the small delta from SEED_BLOCK onward to pick up anything created since.
 *
 * Regenerate by running the equivalent of runScan() from
 * V3_FACTORY_DEPLOY_BLOCK to the current block and recording the results,
 * if this ever drifts far enough behind that re-seeding is worth it.
 */
export interface V3PoolSeedEntry {
  pool: Address;
  token0: Address;
  token1: Address;
  fee: number;
}

export const V3_POOL_SEED_BLOCK = 16743675n;

export const V3_POOL_SEED: readonly V3PoolSeedEntry[] = [
  {
    pool: "0x385CC25ce0e239da715dA568b801CCfB33Ccc906",
    token0: "0x41BC764d38Cd53328107170991b7c1F73Ad78b52",
    token1: "0x7f9a867F7f7B9153e5C7bB0b421AfDa47174D762",
    fee: 500,
  },
  {
    pool: "0x4169E2aFc7Ac3b8e1f271fA15506584482F7C304",
    token0: "0x044b2ED77214aeA517e811f5c80980511F8ff326",
    token1: "0xe415fAEd7f43e22c8Ef0159b33FADF577d94a5f0",
    fee: 3000,
  },
  {
    pool: "0x4D31992baC8052D17C24Eb7df77BaDC89470e858",
    token0: "0x044b2ED77214aeA517e811f5c80980511F8ff326",
    token1: "0x24a5119baFC5C193EA8627Fbe70607f858860627",
    fee: 3000,
  },
  {
    pool: "0x4d3816edC5E449C6A95D3aC671679F068A734d9A",
    token0: "0x6c3f666D78e28349Ad8b277Cda3984010Ee45526",
    token1: "0xa2B189E6e0D32020Eb46964E22AFB5EDb98eae4D",
    fee: 500,
  },
  {
    pool: "0x50D79AE4343a5e1ab51A35254578516efA10c4Ad",
    token0: "0x6551BA06E689D51237908FE26f7c3E83E34C5B72",
    token1: "0xF4D86bf146459e963Cac407CBf29275641817D94",
    fee: 10000,
  },
  {
    pool: "0x78Bd2341884D0E90f284b8D90dD64431eFCD9176",
    token0: "0x044b2ED77214aeA517e811f5c80980511F8ff326",
    token1: "0x6c3f666D78e28349Ad8b277Cda3984010Ee45526",
    fee: 3000,
  },
  {
    pool: "0x7D7f954B24b34bC2ec2a33f77D765D230AbEEC89",
    token0: "0x044b2ED77214aeA517e811f5c80980511F8ff326",
    token1: "0xa2B189E6e0D32020Eb46964E22AFB5EDb98eae4D",
    fee: 3000,
  },
  {
    pool: "0x86eD395daA9D7439963a6489810d2C5A3A50d62A",
    token0: "0xa2B189E6e0D32020Eb46964E22AFB5EDb98eae4D",
    token1: "0xbe15E358F993B982A9D2a8C67686F22E75B2ecE1",
    fee: 3000,
  },
  {
    pool: "0x8AEaD0DBa73D1C8b71a34fdFB35ba4bb6c4774B1",
    token0: "0x9c4229D652f0D0D7CaDc11554aBFFA8C840798d8",
    token1: "0xe415fAEd7f43e22c8Ef0159b33FADF577d94a5f0",
    fee: 3000,
  },
  {
    pool: "0x8C35afB9f86e0dA30DfE8091dFD2e03e5866344d",
    token0: "0x01c3ff252Ca2056a1eFAd546176876612c6Fe9a9",
    token1: "0xbe15E358F993B982A9D2a8C67686F22E75B2ecE1",
    fee: 3000,
  },
  {
    pool: "0x8D4D1B97bc7640F6E83eC049df2a7d56f692Ef01",
    token0: "0x01c3ff252Ca2056a1eFAd546176876612c6Fe9a9",
    token1: "0x044b2ED77214aeA517e811f5c80980511F8ff326",
    fee: 3000,
  },
  {
    pool: "0x8F37D9Db1d304eEfE4C78d0Aa6139E75e284A0a6",
    token0: "0x8e23900Cbc4d0c6c73ac8Fe5d9607B89Ac3AD2e1",
    token1: "0xE9aE7eBA1ca2ec36e03c462Fd232Ab3Da74a4231",
    fee: 500,
  },
  {
    pool: "0x973d65998f8db8873d16a5a52A2D4F5A4dE5CF11",
    token0: "0x6c3f666D78e28349Ad8b277Cda3984010Ee45526",
    token1: "0xa2B189E6e0D32020Eb46964E22AFB5EDb98eae4D",
    fee: 3000,
  },
  {
    pool: "0xA47eB5a6562c041dbF38d29ebAc3DA9a2b97F5A7",
    token0: "0xa2B189E6e0D32020Eb46964E22AFB5EDb98eae4D",
    token1: "0xbe15E358F993B982A9D2a8C67686F22E75B2ecE1",
    fee: 500,
  },
  {
    pool: "0xB42de75537aAE1901B0cD159D16ec2A7aDbf9EFF",
    token0: "0x6c3f666D78e28349Ad8b277Cda3984010Ee45526",
    token1: "0xbe15E358F993B982A9D2a8C67686F22E75B2ecE1",
    fee: 10000,
  },
  {
    pool: "0xb6D45ae939210De903202A41171c4cafeA607A30",
    token0: "0x590e9412a90BEAAe28D4e98e1c8F002D22659f8d",
    token1: "0xF4D86bf146459e963Cac407CBf29275641817D94",
    fee: 10000,
  },
  {
    pool: "0xBEa73Fb8E42335Eb91E1376C8Da163D353a77B1a",
    token0: "0x044b2ED77214aeA517e811f5c80980511F8ff326",
    token1: "0xbe15E358F993B982A9D2a8C67686F22E75B2ecE1",
    fee: 3000,
  },
  {
    pool: "0xbECA04047756eAac3f7D78Ae8dda27347005068C",
    token0: "0x6c3f666D78e28349Ad8b277Cda3984010Ee45526",
    token1: "0xbe15E358F993B982A9D2a8C67686F22E75B2ecE1",
    fee: 3000,
  },
  {
    pool: "0xc19145c33AB52fA74d6aE7C0026bbb85A7088036",
    token0: "0x41BC764d38Cd53328107170991b7c1F73Ad78b52",
    token1: "0x7f9a867F7f7B9153e5C7bB0b421AfDa47174D762",
    fee: 3000,
  },
  {
    pool: "0xc3fbBbCa462F4CF80dC5EEeD7aBfbBBb7a160322",
    token0: "0x8e23900Cbc4d0c6c73ac8Fe5d9607B89Ac3AD2e1",
    token1: "0xE9aE7eBA1ca2ec36e03c462Fd232Ab3Da74a4231",
    fee: 3000,
  },
  {
    pool: "0xCa932D270322c1e21b9f47a4775283e330d20941",
    token0: "0x6551BA06E689D51237908FE26f7c3E83E34C5B72",
    token1: "0xF4D86bf146459e963Cac407CBf29275641817D94",
    fee: 3000,
  },
  {
    pool: "0xD630Ab2f608bB3EA3D29b7b70d020Baf2963da94",
    token0: "0xE6DE9459D0AC5161e770b1B371a539fCf734Fb36",
    token1: "0xF6C05A724c07De440e372F866B22a4E22de768F2",
    fee: 3000,
  },
  {
    pool: "0xDD1DA5510A3039294a635b0C1b27Fc3AF654DC09",
    token0: "0x3A633eab7B31558c7AA1C4ce9B36C8Fd5803D569",
    token1: "0xF4D86bf146459e963Cac407CBf29275641817D94",
    fee: 10000,
  },
  {
    pool: "0xDD3C54f5acC4Dc4f6e9d8c4462E06fE16127dE76",
    token0: "0x590e9412a90BEAAe28D4e98e1c8F002D22659f8d",
    token1: "0xF4D86bf146459e963Cac407CBf29275641817D94",
    fee: 3000,
  },
  {
    pool: "0xDeB4110D90DeAb2bbDA4a212F661d632F2aC84b5",
    token0: "0x01c3ff252Ca2056a1eFAd546176876612c6Fe9a9",
    token1: "0xbe15E358F993B982A9D2a8C67686F22E75B2ecE1",
    fee: 500,
  },
  {
    pool: "0xeE725f7681627BFce4D64aBaC0ebCEf4f60998bB",
    token0: "0x711Dc0Dd81A4cCa64Bc8c3fad4E51D7EeB3082a7",
    token1: "0x9c4229D652f0D0D7CaDc11554aBFFA8C840798d8",
    fee: 3000,
  },
  {
    pool: "0xf1FfeE9Eb9Ae4E8318f6AD4Fe21119AcEC8C63b2",
    token0: "0x5Aa3c80aC7Ebb696834b9F499A7E6E978C7C67fe",
    token1: "0x69aA3818E5000A1c24eD304f4473EBdcE30BF935",
    fee: 3000,
  },
  {
    pool: "0xFC1c4aE17480Bc6C50492b5737D5856aCbc8C3eC",
    token0: "0x3A633eab7B31558c7AA1C4ce9B36C8Fd5803D569",
    token1: "0xF4D86bf146459e963Cac407CBf29275641817D94",
    fee: 3000,
  },
];

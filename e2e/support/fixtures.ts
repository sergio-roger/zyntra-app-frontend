import zlib from 'node:zlib';

function chunk(tag: string, data: Buffer): Buffer {
  const tagBuf = Buffer.from(tag, 'ascii');
  const lengthBuf = Buffer.alloc(4);
  lengthBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(zlib.crc32(Buffer.concat([tagBuf, data])) >>> 0, 0);
  return Buffer.concat([lengthBuf, tagBuf, data, crcBuf]);
}

export function makeTestPng(size = 120): Buffer {
  const rows: Buffer[] = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3);
    for (let x = 0; x < size; x++) {
      row[1 + x * 3] = 220;
      row[1 + x * 3 + 1] = 50 + (x % 100);
      row[1 + x * 3 + 2] = 90 + (y % 100);
    }
    rows.push(row);
  }
  const raw = Buffer.concat(rows);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr.writeUInt8(8, 8); // bit depth
  ihdr.writeUInt8(2, 9); // color type: RGB

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

export const mockUser = {
  id: 'e2e-user-1',
  name: 'Agente Impulse Pro',
  firstName: 'Agente',
  lastName: 'Impulse Pro',
  email: 'agente@impulsepro.demo',
  role: 'admin',
  avatarUrl: null as string | null,
  jobTitle: 'Ejecutivo Comercial Senior',
  isAccountActivated: true,
  createdAt: '2026-01-15T00:00:00.000Z',
};
